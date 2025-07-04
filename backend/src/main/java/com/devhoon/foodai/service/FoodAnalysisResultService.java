package com.devhoon.foodai.service;

import com.devhoon.foodai.dto.FoodAnalysisResultDTO;
import com.devhoon.foodai.entity.FoodAnalysisResult;
import com.devhoon.foodai.entity.User;
import com.devhoon.foodai.repository.FoodAnalysisResultRepository;
import com.devhoon.foodai.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FoodAnalysisResultService {

  @Autowired
  private final UserRepository userRepository;

  private final FoodAnalysisResultRepository foodAnalysisResultRepository;
  private final ModelMapper modelMapper;

  public void saveResult(FoodAnalysisResultDTO dto, String userEmail) {

    // DTO → Entity 매핑
    FoodAnalysisResult result = modelMapper.map(dto, FoodAnalysisResult.class);

    // 사용자 조회
    User user = userRepository.findByEmail(userEmail)
        .orElseThrow(() -> new RuntimeException("해당 이메일의 사용자를 찾을 수 없습니다: " + userEmail));

    // 연관관계 설정
    result.setUser(user);

    // 이미지 등 나머지 필드 설정
    result.setImage(dto.getImage());

    foodAnalysisResultRepository.save(result);
  }

  private FoodAnalysisResultDTO convertToDTO(FoodAnalysisResult result) {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    return FoodAnalysisResultDTO.builder()
        .id(result.getId())
        .label(result.getLabel())
        .calories(result.getCalories())
        .carbohydrates(result.getCarbohydrates())
        .fats(result.getFats())
        .protein(result.getProtein())
        .sodium(result.getSodium())
        .sugars(result.getSugars())
        .weight(result.getWeight())
        .analyzedAt(result.getAnalyzedAt().format(formatter))
        .userEmail(result.getUser().getEmail())
        .image(result.getImage())
        .imageUrl(result.getImageUrl())
        .userDeleted(result.getUser().isDeleted())
        .build();
  }

  // public FoodAnalysisResultDTO getResultById(Long id) {

  // FoodAnalysisResult result = foodAnalysisResultRepository.findById(id)
  // .orElseThrow(() -> new IllegalArgumentException("해당 분석 결과가 없습니다."));

  // return modelMapper.map(result, FoodAnalysisResultDTO.class);
  // }

  public List<FoodAnalysisResultDTO> getAllLogs() {
    return foodAnalysisResultRepository.findAll()
        .stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
  }

  public List<FoodAnalysisResultDTO> getResultsByUser(String email) {
    return foodAnalysisResultRepository.findByUserEmailOrderByAnalyzedAtDesc(email)
        .stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
  }

  public FoodAnalysisResultDTO getResultById(Long id) {
    FoodAnalysisResult result = foodAnalysisResultRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("해당 분석 결과가 없습니다."));
    return convertToDTO(result);
  }
}

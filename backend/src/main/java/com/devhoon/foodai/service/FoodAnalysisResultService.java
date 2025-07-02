package com.devhoon.foodai.service;

import com.devhoon.foodai.dto.FoodAnalysisResultDTO;
import com.devhoon.foodai.entity.FoodAnalysisResult;
import com.devhoon.foodai.repository.FoodAnalysisResultRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FoodAnalysisResultService {

  private final FoodAnalysisResultRepository repository;
  private final ModelMapper modelMapper;

  public void saveResult(FoodAnalysisResultDTO dto, String userEmail) {

    FoodAnalysisResult result = modelMapper.map(dto, FoodAnalysisResult.class);

    result.setImage(dto.getImage());
    result.setUserEmail(userEmail);

    repository.save(result);
  }

  public List<FoodAnalysisResultDTO> getResultsByUser(String email) {

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    return repository.findByUserEmailOrderByAnalyzedAtDesc(email).stream()
        .map(result -> FoodAnalysisResultDTO.builder()
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
            .image(result.getImage())
            .build())
        .collect(Collectors.toList());
  }

  public FoodAnalysisResultDTO getResultById(Long id) {

    FoodAnalysisResult result = repository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("해당 분석 결과가 없습니다."));

    return modelMapper.map(result, FoodAnalysisResultDTO.class);
  }
}

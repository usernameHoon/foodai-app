package com.devhoon.foodai.controller;

import com.devhoon.foodai.dto.FoodAnalysisResultDTO;
import com.devhoon.foodai.service.FoodAnalysisResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/food-analysis")
@RequiredArgsConstructor
public class FoodAnalysisResultController {

  private final FoodAnalysisResultService foodAnalysisResultService;

  /**
   * 분석 결과 저장 (POST)
   */
  @PostMapping
  public ResponseEntity<Void> saveResult(@RequestBody FoodAnalysisResultDTO dto, Principal principal) {

    String userEmail = principal.getName(); // 현재 로그인한 사용자 이메일

    foodAnalysisResultService.saveResult(dto, userEmail);

    return ResponseEntity.ok().build();
  }

  /**
   * 로그인한 사용자의 분석 이력 조회 (GET)
   */
  @GetMapping("/my")
  public ResponseEntity<List<FoodAnalysisResultDTO>> getMyResults(Principal principal) {

    String userEmail = principal.getName();

    List<FoodAnalysisResultDTO> results = foodAnalysisResultService.getResultsByUser(userEmail);

    return ResponseEntity.ok(results);
  }

  /**
   * 분석 결과 상세 조회 (GET by ID)
   */
  @GetMapping("/{id}")
  public ResponseEntity<FoodAnalysisResultDTO> getResultById(@PathVariable("id") Long id) {

    FoodAnalysisResultDTO dto = foodAnalysisResultService.getResultById(id);

    return ResponseEntity.ok(dto);
  }
}

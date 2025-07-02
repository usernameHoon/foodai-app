package com.devhoon.foodai.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devhoon.foodai.entity.FoodAnalysisResult;

import java.time.LocalDateTime;
import java.util.List;

public interface FoodAnalysisResultRepository extends JpaRepository<FoodAnalysisResult, Long> {
  List<FoodAnalysisResult> findByUserEmailOrderByAnalyzedAtDesc(String userEmail);

  long countByAnalyzedAtBetween(LocalDateTime start, LocalDateTime end);
}
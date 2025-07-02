package com.devhoon.foodai.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodAnalysisResultDTO {

  private Long id;
  private String label;
  private double calories;
  private double carbohydrates;
  private double fats;
  private double protein;
  private double sodium;
  private double sugars;
  private double weight;
  private String analyzedAt;
  private String image;

}

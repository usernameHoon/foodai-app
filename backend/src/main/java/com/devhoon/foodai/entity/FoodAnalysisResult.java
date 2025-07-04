package com.devhoon.foodai.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodAnalysisResult {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  private String label;
  private double calories;
  private double carbohydrates;
  private double fats;
  private double protein;
  private double sodium;
  private double sugars;
  private double weight;
  private String image;
  private String imageUrl;

  private LocalDateTime analyzedAt;

  @PrePersist
  protected void onCreate() {
    this.analyzedAt = LocalDateTime.now();
  }
}
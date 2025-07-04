package com.devhoon.foodai.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponseDTO {

  private String token;
  private UserResponseDTO user;

}

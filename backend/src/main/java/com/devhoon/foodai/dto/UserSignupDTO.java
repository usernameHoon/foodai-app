package com.devhoon.foodai.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserSignupDTO {

  private String email;
  private String password;
  private String name;

}
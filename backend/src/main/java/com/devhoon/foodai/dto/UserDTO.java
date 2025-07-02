package com.devhoon.foodai.dto;

import com.devhoon.foodai.entity.User;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

  private Long id;
  private String name;
  private String email;
  private String role;
  private String joinDate;

  public UserDTO(User user) {
    this.id = user.getId();
    this.name = user.getName();
    this.email = user.getEmail();
    this.role = user.getRole().name(); // enum to string
    this.joinDate = user.getJoinDate().toLocalDate().toString();
  }
}

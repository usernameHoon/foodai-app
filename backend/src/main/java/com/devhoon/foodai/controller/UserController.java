package com.devhoon.foodai.controller;

import com.devhoon.foodai.dto.LoginRequestDTO;
import com.devhoon.foodai.dto.LoginResponseDTO;
import com.devhoon.foodai.dto.UserRequestDTO;
import com.devhoon.foodai.security.CustomUserDetails;
import com.devhoon.foodai.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  // 로그인
  @PostMapping("/login")
  public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginDto) {
    LoginResponseDTO response = userService.login(loginDto.getEmail(), loginDto.getPassword());
    return ResponseEntity.ok(response);
  }

  // 회원가입
  @PostMapping("/signup")
  public ResponseEntity<?> signup(@RequestBody UserRequestDTO requestDTO) {
    userService.registerUser(requestDTO);
    return ResponseEntity.ok("회원가입 성공");
  }

  // 회원탈퇴
  @DeleteMapping("/withdraw")
  public ResponseEntity<String> withdraw(@AuthenticationPrincipal CustomUserDetails userDetails) {
    Long userId = userDetails.getUser().getId(); // 또는 getId()
    userService.withdrawUser(userId);
    return ResponseEntity.ok("회원 탈퇴 완료");
  }
}
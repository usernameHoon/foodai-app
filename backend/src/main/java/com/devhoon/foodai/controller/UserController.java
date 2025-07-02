package com.devhoon.foodai.controller;

import com.devhoon.foodai.dto.LoginRequestDTO;
import com.devhoon.foodai.dto.UserRequestDTO;

import com.devhoon.foodai.entity.User;
import com.devhoon.foodai.service.JwtService;
import com.devhoon.foodai.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;
  private final JwtService jwtService;

  // 로그인
  @PostMapping("/login")
  public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequestDTO request) {
    User user = userService.authenticateUser(request.getEmail(), request.getPassword());

    if (user == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "이메일 또는 비밀번호가 일치하지 않습니다."));
    }

    String token = jwtService.generateToken(user);

    Map<String, String> response = new HashMap<>();
    response.put("token", token);
    response.put("email", user.getEmail());
    response.put("name", user.getName());
    response.put("role", user.getRole().name()); // 예: "ADMIN" 또는 "USER"

    return ResponseEntity.ok(response);
  }

  // 회원가입
  @PostMapping("/signup")
  public ResponseEntity<?> signup(@RequestBody UserRequestDTO requestDTO) {
    userService.registerUser(requestDTO);
    return ResponseEntity.ok("회원가입 성공");
  }
}
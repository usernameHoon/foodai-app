package com.devhoon.foodai.controller;

import com.devhoon.foodai.dto.UserDTO;
import com.devhoon.foodai.entity.FoodAnalysisResult;
import com.devhoon.foodai.repository.FoodAnalysisResultRepository;
import com.devhoon.foodai.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

  private final AdminService adminService;
  private final FoodAnalysisResultRepository foodAnalysisResultRepository;

  @GetMapping("/users")
  public ResponseEntity<List<UserDTO>> getAllUsers(@RequestHeader("Authorization") String authHeader) {
    // 이 메서드 자체는 JWT 인증 필터를 통해 보호되어 있다고 가정
    return ResponseEntity.ok(adminService.getAllUsers());
  }

  @GetMapping("/stats")
  public ResponseEntity<Map<String, Object>> getAdminStats() {
    // 관리자를 제외한 통계 데이터 가져오기
    return ResponseEntity.ok(adminService.getAdminStats());
  }

  @GetMapping("/logs")
  public ResponseEntity<List<FoodAnalysisResult>> getAllLogs() {
    List<FoodAnalysisResult> logs = foodAnalysisResultRepository.findAll();
    return ResponseEntity.ok(logs);
  }
}

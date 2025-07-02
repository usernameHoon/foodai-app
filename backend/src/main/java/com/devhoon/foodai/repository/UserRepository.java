package com.devhoon.foodai.repository;

import com.devhoon.foodai.constant.UserRole;
import com.devhoon.foodai.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

  Optional<User> findByEmail(String email);

  List<User> findAllByOrderByIdAsc();

  long countByRoleNot(UserRole role); // "ADMIN" 제외한 사용자 수 카운트
}
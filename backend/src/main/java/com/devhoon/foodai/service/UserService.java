package com.devhoon.foodai.service;

import com.devhoon.foodai.config.JwtProvider;
import com.devhoon.foodai.constant.UserRole;
import com.devhoon.foodai.dto.LoginResponseDTO;
import com.devhoon.foodai.dto.UserRequestDTO;
import com.devhoon.foodai.dto.UserResponseDTO;
import com.devhoon.foodai.entity.User;
import com.devhoon.foodai.exception.AuthenticationFailedException;
import com.devhoon.foodai.exception.DuplicateEmailException;
import com.devhoon.foodai.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

  private final JwtProvider jwtProvider;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public User findByEmail(String email) {

    return userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
  }

  public void registerUser(UserRequestDTO requestDTO) {

    if (userRepository.findByEmail(requestDTO.getEmail()).isPresent()) {
      throw new DuplicateEmailException("이미 존재하는 이메일입니다: " + requestDTO.getEmail());
    }

    User user = User.builder()
        .email(requestDTO.getEmail())
        .password(passwordEncoder.encode(requestDTO.getPassword()))
        .name(requestDTO.getName())
        .joinDate(LocalDateTime.now())
        .role(UserRole.USER)
        .build();
    userRepository.save(user);
  }

  public LoginResponseDTO login(String email, String password) {
    User user = userRepository.findByEmailAndIsDeletedFalse(email)
        .orElseThrow(() -> new AuthenticationFailedException("탈퇴한 사용자이거나 이메일이 존재하지 않습니다."));

    if (!passwordEncoder.matches(password, user.getPassword())) {
      throw new AuthenticationFailedException("비밀번호가 일치하지 않습니다.");
    }

    String token = jwtProvider.generateToken(user.getEmail()); // JWT 발급

    return new LoginResponseDTO(token, new UserResponseDTO(user));
  }

  public User authenticateUser(String email, String password) {

    Optional<User> userOptional = userRepository.findByEmail(email);

    if (userOptional.isPresent()) {
      User user = userOptional.get();

      if (passwordEncoder.matches(password, user.getPassword())) {
        return user;
      }
    }

    return null;
  }

  @Transactional
  public void withdrawUser(Long id) {
    User user = userRepository.findByIdAndIsDeletedFalse(id)
        .orElseThrow(() -> new RuntimeException("이미 탈퇴했거나 존재하지 않는 사용자입니다."));
    user.withdraw(); // user.setIsDeleted(true)
  }
}

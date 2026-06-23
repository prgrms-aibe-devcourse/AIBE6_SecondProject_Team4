package com.fitmate.global.file.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@Tag(
        name = "이미지",
        description = "이미지 업로드 API"
)
@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileUploadController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) throws IOException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // 허용 확장자 체크
        String originalFilename = file.getOriginalFilename();
        String ext = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf('.'))
                : "";
        if (!ext.matches("(?i)\\.(jpg|jpeg|png|webp)")) {
            return ResponseEntity.badRequest().build();
        }

        // 저장 경로 생성
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String savedFilename = UUID.randomUUID() + ext;
        Path filePath = uploadPath.resolve(savedFilename);
        file.transferTo(filePath);

        String fileUrl = "/uploads/" + savedFilename;
        return ResponseEntity.ok(Map.of("url", fileUrl));
    }
}
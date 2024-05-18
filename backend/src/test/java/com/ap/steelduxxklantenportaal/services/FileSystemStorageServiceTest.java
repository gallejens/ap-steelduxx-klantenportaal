package com.ap.steelduxxklantenportaal.services;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class FileSystemStorageServiceTest {

    @Autowired
    private FileSystemStorageService fileSystemStorageService;

    @Test
    void givenFile_whenSavingToFileSystem_thenExpectCorrectFileToLoad() throws Exception {
        byte[] bytes = "This is a testfile".getBytes();
        MockMultipartFile multipartFile = new MockMultipartFile("file", "test.txt",
                "text/plain", bytes);

        var fileName = fileSystemStorageService.store(multipartFile);

        var foundBytes = fileSystemStorageService.load(fileName).getContentAsByteArray();

        assertThat(foundBytes).isEqualTo(bytes);
    }
}





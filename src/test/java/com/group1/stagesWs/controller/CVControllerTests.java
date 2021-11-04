package com.group1.stagesWs.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.group1.stagesWs.enums.CVStatus;
import com.group1.stagesWs.model.CV;
import com.group1.stagesWs.service.CVService;
import com.group1.stagesWs.service.EmailService;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@WebMvcTest(CVController.class)
public class CVControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CVService cvService;

    @MockBean
    private EmailService emailService;

    private static ObjectMapper mapper;

    @BeforeAll
    static void initializeObjectMapper() {
        mapper = new ObjectMapper().findAndRegisterModules();
    }

    @Test
    void testAcceptCV() throws Exception {
        //Arrange
        CV expected = new CV();
        expected.setStatus(CVStatus.ACCEPTED);
        when(cvService.acceptCV(any())).thenReturn(Optional.of(expected));

        //Act
        MvcResult result = mockMvc.perform(post("/cv/accept")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(expected))).andReturn();

        //Assert
        var actual = mapper.readValue(result.getResponse().getContentAsString(), CV.class);
        assertThat(result.getResponse().getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(actual.getStatus()).isEqualTo(CVStatus.ACCEPTED);
    }

    @Test
    void testAcceptCVFail() throws Exception {
        //Arrange
        when(cvService.acceptCV(any())).thenReturn(Optional.empty());

        //Act
        MvcResult result = mockMvc.perform(post("/cv/accept")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(new CV()))).andReturn();

        //Assert
        assertThat(result.getResponse().getStatus()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR.value());
    }

    @Test
    void testRejectCV() throws Exception {
        //Arrange
        CV expected = new CV();
        expected.setStatus(CVStatus.REJECTED);
        when(cvService.rejectCV(any())).thenReturn(Optional.of(expected));

        //Act
        MvcResult result = mockMvc.perform(post("/cv/reject")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(expected))).andReturn();

        //Assert
        var actual = mapper.readValue(result.getResponse().getContentAsString(), CV.class);
        assertThat(result.getResponse().getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(actual.getStatus()).isEqualTo(CVStatus.REJECTED);
    }

    @Test
    void testRejectCVFail() throws Exception {
        //Arrange
        when(cvService.rejectCV(any())).thenReturn(Optional.empty());

        //Act
        MvcResult result = mockMvc.perform(post("/cv/reject")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(new CV()))).andReturn();

        //Assert
        assertThat(result.getResponse().getStatus()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR.value());
    }

    @Test
    void testGetAllCVs() throws Exception {
        //Arrange
        List<CV> expected = List.of(new CV(), new CV(), new CV());
        when(cvService.getAllCVs()).thenReturn(expected);

        //Act
        MvcResult result = mockMvc.perform(get("/cv")).andReturn();

        //Assert
        var actual = mapper.readValue(result.getResponse().getContentAsString(), List.class);
        assertThat(result.getResponse().getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(actual.size()).isEqualTo(3);
    }

    @Test
    void testGetCV() throws Exception {
        //Arrange
        CV expected = new CV();
        expected.setId(1);
        when(cvService.getCVById(any(Integer.class))).thenReturn(Optional.of(expected));

        //Act
        MvcResult result = mockMvc.perform(get("/cv/" + expected.getId())).andReturn();

        //Assert
        var actual = mapper.readValue(result.getResponse().getContentAsString(), CV.class);
        assertThat(result.getResponse().getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(actual).isEqualTo(expected);
    }

    @Test
    void testDeleteCV() throws Exception {
        //Arrange
        CV expected = new CV();
        expected.setId(1);
        when(cvService.deleteCV(any(Integer.class))).thenReturn(true);

        //Act
        MvcResult result = mockMvc.perform(delete("/cv/delete/" + expected.getId())).andReturn();

        //Assert
        var actual = mapper.readValue(result.getResponse().getContentAsString(), Boolean.class);
        assertThat(result.getResponse().getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(actual).isTrue();
    }

    @Test
    void testGetAllCVsAllSession() throws Exception {
        //Arrange
        List<CV> expected = List.of(new CV(), new CV(), new CV());
        when(cvService.getAllCVsAllSession()).thenReturn(expected);

        //Act
        MvcResult result = mockMvc.perform(get("/cv/allSession")).andReturn();

        //Assert
        var actual = mapper.readValue(result.getResponse().getContentAsString(), List.class);
        assertThat(result.getResponse().getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(actual.size()).isEqualTo(3);
    }

}

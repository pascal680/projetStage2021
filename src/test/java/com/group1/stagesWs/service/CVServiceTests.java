package com.group1.stagesWs.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.group1.stagesWs.enums.Status;
import com.group1.stagesWs.model.CV;
import com.group1.stagesWs.model.Etudiant;
import com.group1.stagesWs.model.Notification;
import com.group1.stagesWs.repositories.CVRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

@ExtendWith(MockitoExtension.class)
public class CVServiceTests {

  @Mock
  private CVRepository cvRepository;

  @Mock
  private EmailService emailService;

  @Mock
  private NotificationService notificationService;

  @InjectMocks
  private CVService cvService;

  @Test
  void testAcceptCV() {
    // Arrange
    CV expected = getCV();
    expected.setEtudiant(new Etudiant());
    when(cvRepository.save(any())).thenReturn(expected);
    doNothing().when(emailService).sendEtudiantEmailCVAccepted(expected);
    when(notificationService.saveNotificationEtudiant(any(Notification.class), anyInt()))
        .thenReturn(true);

    // Act
    Optional<CV> returned = cvService.acceptCV(expected);

    // Assert
    assertThat(returned).isEqualTo(Optional.of(expected));
    assertThat(returned.isPresent()).isTrue();
    assertThat(returned.get().getStatus()).isEqualTo(Status.ACCEPTED);
  }

  @Test
  void testRejectCV() {
    // Arrange
    CV expected = getCV();
    expected.setEtudiant(new Etudiant());
    when(cvRepository.save(any())).thenReturn(expected);
    doNothing().when(emailService).sendEtudiantEmailCVRejected(expected);
    when(notificationService.saveNotificationEtudiant(any(Notification.class), anyInt()))
        .thenReturn(true);

    // Act
    Optional<CV> returned = cvService.rejectCV(expected);

    // Assert
    assertThat(returned).isEqualTo(Optional.of(expected));
    assertThat(returned.isPresent()).isTrue();
    assertThat(returned.get().getStatus()).isEqualTo(Status.REJECTED);
  }

  @Test
  void testGetAllCVs() {
    // Arrange
    CV cv1 = getCV(); // Constructeur met leur session par defaut a la session actuelle
    CV cv2 = getCV(); // Constructeur met leur session par defaut a la session actuelle

    CV cv3 = getCV();
    cv3.setSession(
        "AUT-2021"); // La session de ce cv est change de la valeur par defaut qui est la session
    // actuelle
    List<CV> listCV = List.of(cv1, cv2, cv3);
    when(cvRepository.findAll(any(Sort.class))).thenReturn(listCV);

    // Act
    List<CV> returned = cvService.getAllCVs();

    // Assert
    assertThat(returned.size())
        .isEqualTo(3 - 1); // Retout des CV de la session actuelle seulement donc 2/3
  }

  @Test
  void testGetAllCVsToutSession() {
    // Arrange
    CV cv1 = getCV(); // Constructeur met leur session par defaut a la session actuelle
    CV cv2 = getCV(); // Constructeur met leur session par defaut a la session actuelle
    CV cv3 = getCV();
    cv3.setSession(
        "HIVER-2021"); // La session de ce cv est change de la valeur par defaut qui est la session
    // actuelle
    List<CV> expected = List.of(cv1, cv2, cv3);
    when(cvRepository.findAll(any(Sort.class))).thenReturn(expected);

    // Act
    List<CV> returned = cvService.getAllCVsAllSession();

    // Assert
    assertThat(returned.size()).isEqualTo(3); // Retour des CV de tous les sessions donc 3/3
  }

  @Test
  void testGetCVById() {
    // Arrange
    CV expected = getCV();
    expected.setId(1);
    when(cvRepository.findById(1)).thenReturn(Optional.of(expected));

    // Act
    Optional<CV> returned = cvService.getCVById(expected.getId());

    // Assert
    assertThat(returned).isEqualTo(Optional.of(expected));
  }

  @Test
  void testSaveCV() {
    // Arrange
    CV expected = getCV();
    expected.setEtudiant(new Etudiant());
    when(cvRepository.save(any(CV.class))).thenReturn(expected);
    when(notificationService.saveNotificationGestionnaire(any(Notification.class)))
        .thenReturn(true);

    // Act
    Optional<CV> returned = cvService.saveCV(expected);

    // Assert
    assertThat(returned).isEqualTo(Optional.of(expected));
  }

  @Test
  void testDeleteCV() {
    // Arrange
    CV expected = getCV();
    expected.setId(1);
    doNothing().when(cvRepository).deleteById(anyInt());

    // Act
    cvService.deleteCV(expected.getId());

    // Assert
    verify(cvRepository).deleteById(anyInt());
        }

  @Test
  void testGetAllCVEtudiant() {
    // Arrange
    Etudiant expectedEtudiant = new Etudiant();
    expectedEtudiant.setId(1);
    CV expected = getCV();
    expected.setEtudiant(expectedEtudiant);
    CV expected2 = getCV();
    expected2.setEtudiant(expectedEtudiant);
    CV expected3 = getCV();
    expected3.setEtudiant(expectedEtudiant);
    expected3.setSession(
        "HIVER-2021"); // Pour tester qu'on retourne juste les CV a l'etudiant pour la session
    // actuelle
    when(cvRepository.findCVByEtudiantId(any(Integer.class)))
        .thenReturn(List.of(expected, expected2));

    // Act
    List<CV> returnedList = cvService.getAllCVEtudiant(expectedEtudiant.getId());

    // Arrange
    assertThat(returnedList).hasSize(2);
  }

  @Test
  void testGetCVPendingEtRejected() {
    // Arrange
    CV rejected1 = getCV();
    rejected1.setStatus(Status.REJECTED);
    CV rejected2 = getCV();
    rejected2.setStatus(Status.REJECTED);
    List<CV> pending = List.of(getCV(), getCV());
    List<CV> rejected = List.of(rejected1, rejected2);
    when(cvRepository.findCVByStatus(Status.PENDING)).thenReturn(pending);
    when(cvRepository.findCVByStatus(Status.REJECTED)).thenReturn(rejected);

    // Act
    List<CV> actual = cvService.getCVPendingEtRejected();

    // Assert
    assertThat(actual.size()).isEqualTo(pending.size() + rejected.size());
  }

  private CV getCV() {
    CV cv = new CV();
    cv.setNom("cvTest.pdf");
    return cv;
  }
}

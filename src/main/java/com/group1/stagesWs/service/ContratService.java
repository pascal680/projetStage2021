package com.group1.stagesWs.service;

import com.group1.stagesWs.SessionManager;
import com.group1.stagesWs.model.Contrat;
import com.group1.stagesWs.model.Moniteur;
import com.group1.stagesWs.repositories.ContratRepository;
import com.group1.stagesWs.repositories.MoniteurRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ContratService extends SessionManager<Contrat> {

    private final ContratRepository contratRepository;
    private final MoniteurRepository moniteurRepository;

    public ContratService(ContratRepository contratRepository, MoniteurRepository moniteurRepository) {
        this.contratRepository = contratRepository;
        this.moniteurRepository = moniteurRepository;
    }

    public Optional<Contrat> saveContrat(Contrat contrat) {
        return Optional.of(contratRepository.save(contrat));
    }


    @Override
    public List<Contrat> getListForCurrentSession(List<Contrat> listContrat) {
        List<Contrat> listContratCurrentSession = new ArrayList<>();
        for (Contrat contrat : listContrat) {
            if (contrat.getSession().equals(SessionManager.CURRENT_SESSION.getNomSession())) {
                listContratCurrentSession.add(contrat);
            }
        }
        return listContratCurrentSession;
    }

    public List<Contrat> getAllContrats() {
        List<Contrat> listAllContrats = contratRepository.findAll();
        return getListForCurrentSession(listAllContrats);
    }

    public List<Contrat> getContratsByMoniteurEmail(String moniteurEmail) {
        Moniteur moniteur = moniteurRepository.findMoniteurByCourrielIgnoreCase(moniteurEmail);
        List<Contrat> listAllContrats = contratRepository.findContratByMoniteur(moniteur);
        return getListForCurrentSession(listAllContrats);
    }
}


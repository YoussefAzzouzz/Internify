package tn.esprit.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.Entities.StatisticsDTO;
import tn.esprit.Repository.EntrepriseRepository;
import tn.esprit.Repository.JobSeekerRepository;

@Service
public class StatisticsService {

    @Autowired
    private JobSeekerRepository jobSeekerRepository;

    @Autowired
    private EntrepriseRepository entrepriseRepository;

    public StatisticsDTO getStatistics() {
        long jobSeekersCount = jobSeekerRepository.count();
        long enterprisesCount = entrepriseRepository.count();

        return new StatisticsDTO(jobSeekersCount, enterprisesCount);
    }
}

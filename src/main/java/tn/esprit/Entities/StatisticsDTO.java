package tn.esprit.Entities;

public class StatisticsDTO {

    private long jobSeekersCount;
    private long enterprisesCount;

    public StatisticsDTO(long jobSeekersCount, long enterprisesCount) {
        this.jobSeekersCount = jobSeekersCount;
        this.enterprisesCount = enterprisesCount;
    }

    public long getJobSeekersCount() {
        return jobSeekersCount;
    }

    public void setJobSeekersCount(long jobSeekersCount) {
        this.jobSeekersCount = jobSeekersCount;
    }

    public long getEnterprisesCount() {
        return enterprisesCount;
    }

    public void setEnterprisesCount(long enterprisesCount) {
        this.enterprisesCount = enterprisesCount;
    }
}

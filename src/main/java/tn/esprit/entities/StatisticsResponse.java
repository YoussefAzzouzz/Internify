package tn.esprit.entities;

public class StatisticsResponse {
    private long totalDemands;
    private long demandsByField;
    private long demandsByStatus;

    public StatisticsResponse(long totalDemands, long demandsByField, long demandsByStatus) {
        this.totalDemands = totalDemands;
        this.demandsByField = demandsByField;
        this.demandsByStatus = demandsByStatus;
    }

    // Getters and setters
    public long getTotalDemands() {
        return totalDemands;
    }

    public void setTotalDemands(long totalDemands) {
        this.totalDemands = totalDemands;
    }

    public long getDemandsByField() {
        return demandsByField;
    }

    public void setDemandsByField(long demandsByField) {
        this.demandsByField = demandsByField;
    }

    public long getDemandsByStatus() {
        return demandsByStatus;
    }

    public void setDemandsByStatus(long demandsByStatus) {
        this.demandsByStatus = demandsByStatus;
    }

}

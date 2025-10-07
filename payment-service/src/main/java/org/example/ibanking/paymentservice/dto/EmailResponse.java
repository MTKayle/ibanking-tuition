package org.example.ibanking.paymentservice.dto;



import lombok.Data;
import lombok.Generated;

@Data
@Generated
public class EmailResponse {
    private boolean success;

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}


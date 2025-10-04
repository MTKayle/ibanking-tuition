package org.example.ibanking.emailservice.dto;

import lombok.Data;
import lombok.Generated;

@Data
@Generated
public class EmailReponse {
    private boolean success;

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}

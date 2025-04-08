package com.timetrackr.dto;


import lombok.*;


	@Data
		public class AuthResponse {
		    private String token;
		    private Long userId;

		    public AuthResponse() {}

		    public AuthResponse(String token, Long userId) {
		        this.token = token;
		        this.userId = userId;
		    }

		    // getters/setters
		
	    
	    
}

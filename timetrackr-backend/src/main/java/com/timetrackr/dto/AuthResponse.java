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

			public String getToken() {
				return token;
			}

			public void setToken(String token) {
				this.token = token;
			}

			public Long getUserId() {
				return userId;
			}

			public void setUserId(Long userId) {
				this.userId = userId;
			}

		
	    
	    
}

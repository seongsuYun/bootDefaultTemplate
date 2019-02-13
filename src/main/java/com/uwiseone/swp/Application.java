package com.uwiseone.swp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication(scanBasePackages = {Application.BASE_PACKAGES})
@EnableAutoConfiguration
@EnableTransactionManagement
public class Application {
	public static final String BASE_PACKAGES = "com.uwiseone.swp";
	
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

}


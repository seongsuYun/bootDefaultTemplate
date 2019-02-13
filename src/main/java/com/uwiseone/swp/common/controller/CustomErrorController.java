package com.uwiseone.swp.common.controller;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.uwiseone.swp.common.model.ExceptionVO;

@Controller
public class CustomErrorController implements ErrorController {
	
	private Logger log = LoggerFactory.getLogger(this.getClass());
	
	private static final String PATH = "/error";
	private String VIEW_PATH = "/errors/";

    @RequestMapping(value = PATH)
    public String error(Model model, HttpServletRequest request, HttpServletResponse response) {
    	int statusCode = (Integer)request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
    	Exception exception = (Exception) request.getAttribute(RequestDispatcher.ERROR_EXCEPTION);
    	
    	ExceptionVO evo = null;
    	if(exception != null) {
    		evo = new ExceptionVO("Exception on server occurred", exception.toString());
    		request.setAttribute("msg", evo.toString());
            response.setHeader("x-status", "Exception");
            model.addAttribute("throwable", exception);
            
    		log.info(evo.toString());
    	}
    	
        if(statusCode == HttpStatus.NOT_FOUND.value()) {
            return VIEW_PATH + "404";
        } else if(statusCode == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
        	return VIEW_PATH + "500";
        }
        
        return VIEW_PATH + "error";
    }
	
	@Override
	public String getErrorPath() {
		return PATH;
	}
}

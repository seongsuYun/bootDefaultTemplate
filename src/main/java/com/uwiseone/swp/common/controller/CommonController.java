package com.uwiseone.swp.common.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.uwiseone.swp.common.model.CommandMap;
import com.uwiseone.swp.common.service.CommonService;

@Controller
@RequestMapping(value = "/common")
public class CommonController {
	
	@Autowired
	private CommonService commonService;
	
	@RequestMapping(value = "/i18n.js", method = RequestMethod.GET)
	public String boardMain(HttpServletRequest request, Model model, CommandMap map) throws Exception {	
		model.addAttribute("keys", commonService.getResourceBundleKeys());
		return "/common/i18n";
	}
	
}

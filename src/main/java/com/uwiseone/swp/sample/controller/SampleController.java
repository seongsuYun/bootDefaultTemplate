package com.uwiseone.swp.sample.controller;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.uwiseone.swp.common.model.CommandMap;
import com.uwiseone.swp.sample.model.SampleVo;
import com.uwiseone.swp.sample.service.SampleService;

@Controller
public class SampleController {

	private Logger log = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	private SampleService service;
	
	/**
	 * 기본 페이지 조회
	 * @param model
	 * @param param
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = { "/", "/index" }, method = RequestMethod.GET)
    public String index(Model model, Map<String, Object> param, CommandMap map) throws Exception {
		param.put("userindex", "0000318050413090909");
		
        String message = "Hello Spring Boot + Tiles";
		String today = service.getToday();
		SampleVo sampleVo = service.getSampleMemberInfo(param);
		
		log.info("message : {}", message);
		log.info("today : {}", today);
		log.info("sampleVo : {}", sampleVo.toString());
		
        model.addAttribute("message", message);
        model.addAttribute("today", today);
        model.addAttribute("sampleVo", sampleVo);

        return "/sample/index";
    }
	
	/**
	 * 홈 화면 조회
	 * @param model
	 * @param param
	 * @return
	 */
	@RequestMapping(value = "/home")
	public String home(Model model, Map<String, Object> param) {
		return "/sample/home";
	}
	
	/**
	 * 트랜잭션 테스트
	 * @param model
	 * @param param
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/transaction")
	public String transaction(Model model, Map<String, Object> param) throws Exception {
		param.put("USER_ID", "ssyun");
		param.put("USER_NAME", "윤성수");
		service.saveSampleData(param);
		
		return "/sample/home";
	}
}

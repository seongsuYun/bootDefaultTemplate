package com.uwiseone.swp.sample.service;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uwiseone.swp.sample.mapper.SampleMapper;
import com.uwiseone.swp.sample.model.SampleVo;

@Service
public class SampleService {
	
	private Logger log = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	private SampleMapper mapper;
	
	/**
	 * 현재 날짜시분초 조회
	 * @return
	 */
	public String getToday() throws Exception {
		return mapper.getToday();
	}
	
	/**
	 * 샘플 구성원 조회
	 * @param param
	 * @return
	 */
	public SampleVo getSampleMemberInfo(Map<String, Object> param) throws Exception {
		return mapper.getSampleMemberInfo(param);
	}
	
	/**
	 * 트랜잭션 처리 샘플저장
	 * @param param
	 */
	@Transactional
	public void saveSampleData(Map<String, Object> param) throws Exception {
		log.info("[Transaction Test] Start...");
		mapper.addTestData1(param);
		mapper.addTestData2(param);
		log.info("[Transaction Test] Success.");
	}
}

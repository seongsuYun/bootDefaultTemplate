package com.uwiseone.swp.sample.mapper;

import java.sql.SQLException;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.uwiseone.swp.sample.model.SampleVo;

@Mapper
public interface SampleMapper {
	
	/**
	 * 오늘날짜 조회
	 * @return
	 */
	public String getToday();
	
	/**
	 * 샘플 구성원 조회
	 * @param param
	 * @return
	 */
	public SampleVo getSampleMemberInfo(Map<String, Object> param) throws SQLException;
	
	/**
	 * 샘플 트랜잭션 테스트1
	 * @param param
	 * @return
	 */
	public int addTestData1(Map<String, Object> param) throws SQLException;
	
	/**
	 * 샘플 트랜잭션 테스트2
	 * @param param
	 * @return
	 */
	public int addTestData2(Map<String, Object> param) throws SQLException;
}

import {has} from 'lodash';
import grades from './grades.js';

type SecurityheadersOptions = {
	grade?: string;
};

type HeadersResult = Record<'hasServer' | 'hasContentSecurityPolicy' | 'hasPublicKeyPins' | 'hasFeaturePolicy' | 'hasReferrerPolicy' | 'hasStrictTransportSecurity' | 'hasXContentTypeOptions' | 'hasXFrameOptions' | 'hasXXssProtection' | 'certExpired' | 'failed', boolean>;
type GradeResult = HeadersResult & {grade: string; score: number};

function calculateGrade(result: HeadersResult): GradeResult {
	let score = 0;

	if (result.hasContentSecurityPolicy) {
		score += 1;
	}

	if (result.hasPublicKeyPins) {
		score += 1;
	}

	if (result.hasFeaturePolicy) {
		score += 1;
	}

	if (result.hasReferrerPolicy) {
		score += 1;
	}

	if (result.hasStrictTransportSecurity) {
		score += 1;
	}

	if (result.hasXContentTypeOptions) {
		score += 1;
	}

	if (result.hasXFrameOptions) {
		score += 1;
	}

	if (result.hasXXssProtection) {
		score += 1;
	}

	if (result.certExpired || result.failed) {
		score = 0;
	}

	score = Math.max(score, 0);

	const grade = grades[score];

	return {grade, score, ...result};
}

function failGrade(result: GradeResult, grade: string) {
	return grades.getScore(grade) > result.score;
}

function securityheaders(headers: HeadersResult, {grade}: SecurityheadersOptions = {}) {
	const result = calculateGrade({
		hasPublicKeyPins: has(headers, 'public-key-pins'),
		hasServer: has(headers, 'server'),
		hasStrictTransportSecurity: has(headers, 'strict-transport-security'),
		hasContentSecurityPolicy: has(headers, 'content-security-policy'),
		hasXFrameOptions: has(headers, 'x-frame-options'),
		hasXXssProtection: has(headers, 'x-xss-protection'),
		hasXContentTypeOptions: has(headers, 'x-content-type-options'),
		hasReferrerPolicy: has(headers, 'referrer-policy'),
		hasFeaturePolicy: has(headers, 'feature-policy'),
		...headers,
	});

	if (grade && failGrade(result, grade)) {
		return {...result, error: new Error(`Did not pass minimum grade, expected ${grade} to pass`)};
	}

	return result;
}

export default securityheaders;

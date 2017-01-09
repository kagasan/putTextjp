#include "opencv2\opencv.hpp"
#include "puttextjp.h"


int main(){

	pTj.init();
	cv::Mat img(480, 640, CV_8UC3,cv::Scalar(255, 255, 255));
	cv::circle(img, cv::Point(100, 200), 50, cv::Scalar(0, 0, 255), -1);
	cv::circle(img, cv::Point(0, 0), 100, cv::Scalar(0, 0, 255), -1);
	pTj.putText(img, "‚ ‚¢‚¤‚ ‚¢‚ ‚¢‚ ‚¢‚ ‚¤‚¤‚¤", cv::Point(0, 0));
	while (1){
		cv::imshow("window", img);
		int key = cv::waitKey(1);
		if (key == 'q')break;
	}

	return 0;
}
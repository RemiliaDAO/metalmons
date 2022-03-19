#include <stdlib.h>
#include <stdio.h>
#include <poll.h>
#include <unistd.h>

int main(int argc, char **argv){
	
	if(argc>2){
		puts("reveal a.js timeinterval");
		return EXIT_SUCCESS;
	}
	
	char geth_args[1024] = {0};
	snprintf(geth_args,sizeof(geth_args)-1,"geth attach http://127.0.0.1:8545 --exec 'loadScript(\"%s\")'",argv[1]);
	printf("command: %s\n",geth_args);
try_again:;
	FILE *geth = popen(geth_args,"r");
/*
	struct pollfd poll_fd = {
		 .fd = fileno(geth),
		 .events = POLLIN,
	};
	
	poll(&poll_fd,1,2000);
	if(poll_fd.revents & POLLIN){
		char result[1024] = {0};
		
		fread(result,sizeof(result)-1,1,geth);
		
		printf("result: %s\n",result);
	}
	else{
		pclose(geth);
		printf("error. try again\n");
		goto try_again;
	}*/
	
	char result[1024] = {0};
		
	fread(result,sizeof(result)-1,1,geth);
		
	printf("result: %s\n",result);
	
	printf("wait\n");
	sleep(5);
	printf("done waiting\n");
	goto try_again;
}
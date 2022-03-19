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
	
	int past_supply = 0;
	int current_supply = 0;
	
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
	current_supply = atoi(result); 
	
	for(int i = past_supply; i < current_supply; i++){
		printf("comitting %d\n",i);
		int x = i + 1;
		snprintf(result,sizeof(result),"cp smm/g2smm%03d.mp4 ../www/mons/g2smm%03d.mp4",x,x);
		system(result);
		snprintf(result,sizeof(result),"cp smm/g2smm%03d.PNG ../www/mons/g2smm%03d.png",x,x);
		system(result);
		snprintf(result,sizeof(result),"cp json/%d ../www/mons/json/%d",i,i);
		system(result);
		snprintf(result,sizeof(result),"git add ../www/mons/g2smm%03d.mp4",x);
		system(result);
		snprintf(result,sizeof(result),"git add ../www/mons/g2smm%03d.png",x);
		system(result);
		snprintf(result,sizeof(result),"git add ../www/mons/json/%d",i);
		system(result);
		
	}
	if(past_supply != current_supply){
		system("git commit -am\"new reveals\"");
		system("git push origin master");
	}
		
	printf("%s of 777\n",result);
	
	past_supply = current_supply;
	

	sleep(10);
	
	goto try_again;
}
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

interface RageMasterlist {
	[ip: string]: {
		name: string;
		gamemode: string;
		url: string;
		lang: string;
		players: number;
		peak: number;
		maxplayers: number;
	}
}

@Injectable({
	providedIn: 'root'
})
export class BackgroundService {
	
	public serverStatus: boolean = false;

	constructor(private http: HttpClient) {
		this.getServerStatus();
	}

	getServerStatus(): void {
		this.http.get<RageMasterlist>('https://cdn.rage.mp/master/').subscribe(list => {
			this.serverStatus = !!list['77.68.86.205:22005'];
		})
	}
}
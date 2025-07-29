import {
	NgFor,
	NgIf,
	NgSwitch,
	NgSwitchCase,
	NgSwitchDefault,
} from "@angular/common";
import { Component } from "@angular/core";

@Component({
	selector: "app-ngif",
	imports: [NgIf, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault],
	templateUrl: "./ngif.html",
	styleUrl: "./ngif.scss",
})
export class Ngif {
	condition: boolean = true;
	flg = "1";
}

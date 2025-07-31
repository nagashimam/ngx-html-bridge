import { Component } from "@angular/core";

@Component({
	selector: "app-attr",
	imports: [],
	templateUrl: "./attr.html",
	styleUrl: "./attr.scss",
})
export class Attr {
	protected hiddenStatus = "until-found";
	protected lang = "ja";
	protected translate = "no";
}

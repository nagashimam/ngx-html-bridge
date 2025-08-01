import { Component, input } from "@angular/core";

@Component({
	selector: "app-attr",
	imports: [],
	templateUrl: "./attr.html",
	styleUrl: "./attr.scss",
})
export class Attr {
	hiddenStatus = "until-found";
	protected lang = "ja";
	protected translate = input("no");
}

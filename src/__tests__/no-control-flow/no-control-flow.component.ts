import { Component } from "@angular/core";

@Component({
	selector: "app-no-control-flow",
	imports: [],
	templateUrl: "./no-control-flow.component.html",
	styleUrl: "./no-control-flow.component.scss",
})
export class NoControlFlowComponent {
	protected title = "hello world";

	// for testing purpose only
	protected title2 = "good night world";
	private title3 = "good morning world";
	title4 = "good bye world";

	constructor() {
		console.log(this.title3);
	}
}

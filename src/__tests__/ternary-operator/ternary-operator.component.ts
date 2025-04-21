import { Component } from "@angular/core";

@Component({
	selector: "app-ternary-operator",
	imports: [],
	templateUrl: "./ternary-operator.component.html",
	styleUrl: "./ternary-operator.component.scss",
})
export class TernaryOperatorComponent {
	protected flagA = true;
	protected flagB = true;
	protected titleA = "hi";
	protected titleB = "hello";
}

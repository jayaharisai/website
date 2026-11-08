import ArrowButton, { type ArrowButtonOwnProps } from "../shared/arrow-button";
import "./secondary-button.css";

export default function SecondaryButton(props: ArrowButtonOwnProps) {
  return <ArrowButton {...props} variant="secondary-button" />;
}

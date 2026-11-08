import ArrowButton, { type ArrowButtonOwnProps } from "../shared/arrow-button";
import "./primary-button.css";

export default function PrimaryButton(props: ArrowButtonOwnProps) {
  return <ArrowButton {...props} variant="primary-button" />;
}

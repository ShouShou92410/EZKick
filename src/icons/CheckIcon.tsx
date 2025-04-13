type Props = {
	width?: string;
	height?: string;
};
const CheckIcon = ({ width = '24', height = '24' }: Props) => (
	<svg
		viewBox="0 0 24 24"
		width={width}
		height={height}
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
		<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
		<g id="SVGRepo_iconCarrier">
			<path
				d="M4 12.6111L8.92308 17.5L20 6.5"
				stroke="#ffffff"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			></path>
		</g>
	</svg>
);
export default CheckIcon;

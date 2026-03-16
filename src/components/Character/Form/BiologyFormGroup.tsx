import { Button, LinearProgress, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import { RiArrowLeftBoxLine, RiArrowRightBoxLine } from "@remixicon/react";
import { useStore } from "@tanstack/react-store";
import { useEffect, useRef } from "react";

import type { CharacterFormState } from "#/components/Character/Form/UseCharacterForm";
import { withFieldGroup } from "#/integrations/tanstack-form/UseAppForm";
import {
	AttributeKey,
	AttributeLabels,
	AttributeOrder,
} from "#/lib/system/types/attributeKey";
import { MetatypeKey, metatypes } from "#/lib/system/types/MetatypeData.ts";

export interface BiologyFormState {
	buildPoints: {
		total: number;
		spent: {
			metatype: number;
			attributes: number;
		};
	};

	metatype: CharacterFormState["metatype"];
	attributes: CharacterFormState["attributes"];
}

export interface AttributesFormState {
	buildPoints: {
		total: number;
		spent: {
			attributes: number;
		};
	};

	metatype: CharacterFormState["metatype"];
	attributes: CharacterFormState["attributes"];
}

const biologyDefaultValues: BiologyFormState = {
	buildPoints: {
		total: 400,
		spent: {
			metatype: 0,
			attributes: 0,
		},
	},

	metatype: MetatypeKey.Human,
	attributes: {
		body: 1,
		agility: 1,
		reaction: 1,
		strength: 1,
		charisma: 1,
		intuition: 1,
		logic: 1,
		willpower: 1,
		edge: 1,
		essence: 6,
		magic: 0,
		resonance: 0,
	},
};

const attributesDefaultValues: AttributesFormState = {
	buildPoints: {
		total: 400,
		spent: {
			attributes: 0,
		},
	},

	metatype: MetatypeKey.Human,
	attributes: {
		body: 1,
		agility: 1,
		reaction: 1,
		strength: 1,
		charisma: 1,
		intuition: 1,
		logic: 1,
		willpower: 1,
		edge: 1,
		essence: 6,
		magic: 0,
		resonance: 0,
	},
};

const ATTRIBUTE_POINT_COST = 10;
const ATTRIBUTE_MAX_COST = 25;
const ATTRIBUTES_BP_CAP = 200;

export const AttributesFormGroup = withFieldGroup({
	defaultValues: attributesDefaultValues,
	render: function Render({ group }) {
		const attributes = useStore(group.store, (s) => s.values.attributes);
		const bpSpent = useStore(
			group.store,
			(s) => s.values.buildPoints?.spent?.attributes ?? 0,
		);
		const metatypeName = useStore(
			group.store,
			(s) => s.values.metatype,
		) as keyof typeof metatypes;
		const metatype = metatypes[metatypeName];

		const getAttrMax = (k: AttributeKey) =>
			metatype?.attributes?.[k]?.max ?? Number.POSITIVE_INFINITY;

		// Build a display list: exclude essence (cannot be purchased) and hide magic/resonance when their metatype max is < 1
		const displayOrder = AttributeOrder.filter((k) => {
			if (k === AttributeKey.essence) return false;
			if (
				(k === AttributeKey.magic || k === AttributeKey.resonance) &&
				(metatype?.attributes?.[k]?.max ?? 0) < 1
			)
				return false;
			return true;
		});

		const maxedCount = displayOrder.reduce(
			(acc, k) => acc + (attributes[k] >= getAttrMax(k) ? 1 : 0),
			0,
		);

		const increment = (key: AttributeKey) => {
			const prev = attributes[key] ?? 0;
			const max = getAttrMax(key);
			if (prev >= max) return; // already at or above max

			const willBeMax = prev + 1 === max;
			if (willBeMax && maxedCount > 0) return; // only one attribute may be maxed

			const cost = willBeMax ? ATTRIBUTE_MAX_COST : ATTRIBUTE_POINT_COST;
			if ((bpSpent ?? 0) + cost > ATTRIBUTES_BP_CAP) return; // can't spend more than cap

			group.setFieldValue(`attributes.${key}`, (p: number | undefined) => (p ?? 0) + 1);
			group.setFieldValue(
				"buildPoints.spent.attributes",
				(p: number | undefined) => (p ?? 0) + cost,
			);
		};

		const decrement = (key: AttributeKey) => {
			const prev = attributes[key] ?? 0;
			const min = metatype?.attributes?.[key]?.value ?? 0;
			if (prev <= min) return; // cannot go below metatype start
			const max = getAttrMax(key);
			const wasMax = prev === max;
			const refund = wasMax ? ATTRIBUTE_MAX_COST : ATTRIBUTE_POINT_COST;

			group.setFieldValue(`attributes.${key}`, (p: number | undefined) =>
				Math.max(min, (p ?? 0) - 1),
			);
			group.setFieldValue(
				"buildPoints.spent.attributes",
				(p: number | undefined) => Math.max(0, (p ?? 0) - refund),
			);
		};

		return (
			<Stack gap={1}>
				<Typography variant="caption">
					{bpSpent} / {ATTRIBUTES_BP_CAP} BP
				</Typography>

				<LinearProgress
					variant="determinate"
					value={Math.min(100, Math.round(((bpSpent ?? 0) / ATTRIBUTES_BP_CAP) * 100))}
				/>

				<Stack gap={0.5}>
					{displayOrder.map((key) => {
						const current = attributes[key] ?? 0;
						const max = getAttrMax(key);
						const nextIsMax = current + 1 === max;
						const nextCost = nextIsMax ? ATTRIBUTE_MAX_COST : ATTRIBUTE_POINT_COST;
						const canIncrement =
							current < max &&
							(bpSpent ?? 0) + nextCost <= ATTRIBUTES_BP_CAP &&
							!(nextIsMax && maxedCount > 0);
						const min = metatype?.attributes?.[key]?.value ?? 0;
						const canDecrement = current > min;
						const wasMax = current === max;
						const incLabel = canIncrement ? `+${nextCost} BP` : "MAX";
						const decLabel = canDecrement ? `-${wasMax ? ATTRIBUTE_MAX_COST : ATTRIBUTE_POINT_COST} BP` : "MIN";

						return (
							<Stack key={key} direction="row" gap={1} alignItems="center" sx={{ width: "100%" }}>
								<Button
									startIcon={<RiArrowLeftBoxLine />}
									variant="outlined"
									onClick={() => decrement(key)}
									disabled={!canDecrement}
									sx={{ width: 120, display: "flex", alignItems: "center" }}
								>
									<span style={{ flexGrow: 1, textAlign: "center" }}>{decLabel}</span>
								</Button>

								<Stack flexGrow={1} alignItems="center" justifyContent="center">
									<Typography sx={{ textAlign: "center", width: "100%" }}>
										{AttributeLabels[key]}: {current} / {metatype?.attributes?.[key]?.max ?? "-"}
									</Typography>
								</Stack>

								<Button
									endIcon={<RiArrowRightBoxLine />}
									variant="outlined"
									onClick={() => increment(key)}
									disabled={!canIncrement}
									sx={{ width: 120, display: "flex", alignItems: "center" }}
								>
									<span style={{ flexGrow: 1, textAlign: "center" }}>{incLabel}</span>
								</Button>
							</Stack>
						);
					})}
				</Stack>
			</Stack>
		);
		},
});

export const BiologyFormGroup = withFieldGroup({
	defaultValues: biologyDefaultValues,
	render: function Render({ group }) {
		const metatypeName = useStore(group.store, (s) => s.values.metatype) as keyof typeof metatypes;

		// Reset attributes to metatype starting values when metatype changes (refund attribute BP)
		const prevMetatypeRef = useRef<keyof typeof metatypes | null>(null);
		useEffect(() => {
			if (prevMetatypeRef.current && prevMetatypeRef.current !== metatypeName) {
				// set each attribute to the metatype's starting value
				AttributeOrder.forEach((k) => {
					const start = metatypes[metatypeName]?.attributes?.[k]?.value ?? 0;
					group.setFieldValue(`attributes.${k}`, start);
				});
				// refund attribute BP spent
				group.setFieldValue("buildPoints.spent.attributes", 0);
			}
			prevMetatypeRef.current = metatypeName;
		}, [metatypeName, group]);

		return null;
	},
});

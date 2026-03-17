import { useStore } from "@tanstack/react-store";
import { useEffect } from "react";
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts";
import type { QualityData } from "#/lib/system/types/qualityData.ts";

export interface QualityWithIndex {
	quality: QualityData;
	index: number;
}

export function useQualitiesFormGroup(form: PlayerCharacterForm) {
	const qualities = useStore(form.store, (s) => s.values.qualities);

	const positiveQualities: QualityWithIndex[] = qualities
		.map((quality, index) => ({ quality, index }))
		.filter(({ quality }) => quality.positive);

	const negativeQualities: QualityWithIndex[] = qualities
		.map((quality, index) => ({ quality, index }))
		.filter(({ quality }) => !quality.positive);

	const positiveBPSpent = positiveQualities.reduce(
		(total, { quality }) => total + (quality.cost ?? 0),
		0,
	);

	const negativeBPGranted = negativeQualities.reduce(
		(total, { quality }) => total + (quality.cost ?? 0),
		0,
	);

	const netBPSpent = positiveBPSpent - negativeBPGranted;

	// biome-ignore lint/correctness/useExhaustiveDependencies: form.setFieldValue is stable
	useEffect(() => {
		form.setFieldValue("buildPoints.spent.qualities", netBPSpent);
	}, [netBPSpent]);

	const addQuality = (quality: QualityData) => {
		form.setFieldValue("qualities", (prev) => [...prev, quality]);
	};

	const updateQuality = (index: number, updated: QualityData) => {
		form.setFieldValue("qualities", (prev) => {
			const next = [...prev];
			next[index] = updated;
			return next;
		});
	};

	const removeQuality = (index: number) => {
		form.setFieldValue("qualities", (prev) =>
			prev.filter((_, qualityIndex) => qualityIndex !== index),
		);
	};

	return {
		positiveQualities,
		negativeQualities,
		positiveBPSpent,
		negativeBPGranted,
		netBPSpent,
		addQuality,
		updateQuality,
		removeQuality,
	};
}

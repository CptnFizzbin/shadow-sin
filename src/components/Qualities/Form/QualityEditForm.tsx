import { type FC, type RefObject, useEffect } from "react";
import { QualityFormFields } from "#/components/Qualities/Form/QualityForm";
import {
  type QualityForm,
  useQualityForm,
} from "#/components/Qualities/Form/UseQualityForm";
import type { QualityData } from "#/lib/system/types/qualityData";

interface QualityEditFormProps {
  quality: QualityData;
  onSubmit: (values: QualityData) => void;
  formRef?: RefObject<QualityForm | null>;
}

export const QualityEditForm: FC<QualityEditFormProps> = ({
  quality,
  onSubmit,
  formRef,
}) => {
  const form = useQualityForm({ mode: "edit", quality, onSubmit });

  useEffect(() => {
    if (!formRef) return;
    formRef.current = form;

    return () => {
      formRef.current = null;
    };
  }, [form, formRef]);

  return <QualityFormFields form={form} />;
};

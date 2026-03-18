import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RiArrowDownSLine } from '@remixicon/react';
import type { FC } from 'react';
import { useState } from 'react';
import { SinsAndLicensesSection } from '#/components/Character/Form/Gear/SinsAndLicensesSection.tsx';
import {
  formatNuyen,
  GEAR_BP_ALLOWANCE,
  GEAR_NUYEN_BUDGET,
  useGearFormGroup,
} from '#/components/Character/Form/Gear/UseGearFormGroup.ts';
import type { PlayerCharacterForm } from '#/components/Character/Form/UseCharacterForm.ts';

interface GearFormGroupProps {
  form: PlayerCharacterForm;
}

const PLACEHOLDER_SECTIONS = [
  'Weapons',
  'Armor',
  'Vehicles',
  'Cyberware',
  'Misc',
] as const;

export const GearFormGroup: FC<GearFormGroupProps> = ({ form }) => {
  const { totalNuyen, gearBP, isOverBudget } = useGearFormGroup(form);

  const [expandedSection, setExpandedSection] = useState<string | false>(
    'SINs & Licenses',
  );

  const progressPercent = Math.min(
    100,
    Math.round((totalNuyen / GEAR_NUYEN_BUDGET) * 100),
  );

  const handleAccordionChange =
    (section: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedSection(isExpanded ? section : false);
    };

  return (
    <Stack gap={1}>
      <Stack gap={0.5}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="caption">
            {totalNuyen.toLocaleString()}¥ /{' '}
            {GEAR_NUYEN_BUDGET.toLocaleString()}¥
          </Typography>
          <Typography variant="caption">
            {gearBP} / {GEAR_BP_ALLOWANCE} BP
          </Typography>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={progressPercent}
          color={isOverBudget ? 'error' : 'primary'}
        />
      </Stack>

      {isOverBudget && (
        <Alert severity="error">
          Gear budget exceeded! Maximum is {GEAR_NUYEN_BUDGET.toLocaleString()}¥
          ({GEAR_BP_ALLOWANCE} BP).
        </Alert>
      )}

      {PLACEHOLDER_SECTIONS.map((sectionName) => (
        <Accordion
          key={sectionName}
          expanded={expandedSection === sectionName}
          onChange={handleAccordionChange(sectionName)}
          disableGutters
          elevation={0}
          sx={{ border: '1px solid', borderColor: 'divider' }}
        >
          <AccordionSummary
            expandIcon={<RiArrowDownSLine />}
            sx={{ padding: 1 }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{
                flexGrow: 1,
                paddingRight: 1,
                marginRight: 1,
                borderRight: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography>{sectionName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {formatNuyen(0)}
              </Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Coming soon.
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}

      <Accordion
        expanded={expandedSection === 'SINs & Licenses'}
        onChange={handleAccordionChange('SINs & Licenses')}
        disableGutters
        elevation={0}
        sx={{ border: '1px solid', borderColor: 'divider' }}
      >
        <AccordionSummary expandIcon={<RiArrowDownSLine />} sx={{ padding: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
              flexGrow: 1,
              paddingRight: 1,
              marginRight: 1,
              borderRight: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography>SINs &amp; Licenses</Typography>
            <Typography variant="body2" color="text.secondary">
              {formatNuyen(totalNuyen)}
            </Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 1 }}>
          <SinsAndLicensesSection form={form} />
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
};

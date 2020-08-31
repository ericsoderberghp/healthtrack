import React, { useContext } from 'react';
import { Box, Button, CheckBox, Text, TextInput } from 'grommet';
import TrackContext from './TrackContext';

const CriteriaEdit = ({ criteria, onChange, onDone }) => {
  const [track] = useContext(TrackContext);

  return (
    <Box>
      <Box direction="row">
        <Button label="done editing" onClick={onDone} />
      </Box>
      {track.categories.map((category) => {
        const checked = !!criteria.find((c) => c.category === category.id);
        const categoryCriteria = criteria.filter(
          (c) => c.category === category.id,
        );
        return (
          <Box key={category.id} border="top">
            <Box direction="row" pad="small" gap="small">
              <CheckBox
                checked={checked}
                onChange={(event) => {
                  if (event.target.checked)
                    onChange([...criteria, { category: category.id }]);
                  else
                    onChange(
                      criteria.filter((c) => c.category !== category.id),
                    );
                }}
              />
              <Text weight="bold">{category.name}</Text>
            </Box>
            {checked && category.type === 'name' && (
              <Box margin={{ start: 'large' }} gap="xsmall" align="start">
                {categoryCriteria.map((crit, index) => {
                  let tmpIndex = 0;
                  const criteriaIndex = criteria.findIndex((c) => {
                    if (c.category === crit.category)
                      if (tmpIndex === index) return true;
                      else tmpIndex += 1;
                    return false;
                  });
                  return (
                    <Box key={index} direction="row">
                      <TextInput
                        value={crit.name}
                        onChange={(event) => {
                          const nextCriteria = JSON.parse(
                            JSON.stringify(criteria),
                          );
                          nextCriteria[criteriaIndex].name = event.target.value;
                          onChange(nextCriteria);
                        }}
                      />
                      {categoryCriteria.length > 1 && (
                        <Button
                          label="delete"
                          onClick={() => {
                            const nextCriteria = [...criteria];
                            nextCriteria.splice(criteriaIndex, 1);
                            onChange(nextCriteria);
                          }}
                        />
                      )}
                    </Box>
                  );
                })}
                <Button
                  label="add"
                  onClick={() =>
                    onChange([...criteria, { category: category.id, name: '' }])
                  }
                />
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default CriteriaEdit;

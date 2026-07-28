import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

export default function ServiceDetailsForm({
  newService,
  handleChange,
  loading,
}) {
  return (
    <>
      <div className="flex flex-col md:flex-row w-full justify-between gap-4 min-w-[300px] px-8">
        <TextField
          label="Service name"
          name="name"
          value={newService.name}
          disabled={loading}
          onChange={handleChange}
          className="w-full md:w-1/2"
        />
        <FormControl className="w-full md:w-1/2">
          <InputLabel id="difficulty-label">Difficulty</InputLabel>
          <Select
            labelId="difficulty-label"
            id="diffuculty-select"
            value={newService.difficulty}
            name="difficulty"
            label="Difficulty"
            onChange={handleChange}
          >
            <MenuItem value="Easy">Easy</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Hard">Hard</MenuItem>
            <MenuItem value="Expert">Expert</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="flex flex-col md:flex-row w-full justify-between gap-4 min-w-[300px] px-8">
        <TextField
          label="Duration (in minutes)"
          name="duration"
          type="number"
          value={newService.duration}
          disabled={loading}
          className="w-full md:w-1/2"
          onChange={handleChange}
        />

        <FormControl className="w-full md:w-1/2">
          <InputLabel id="frequency-label">Frequency</InputLabel>
          <Select
            labelId="frequency-label"
            id="frequency-select"
            value={
              Array.isArray(newService.frequency)
                ? newService.frequency
                : newService.frequency
                ? newService.frequency.split(" - ")
                : []
            }
            name="frequency"
            label="Frequency"
            multiple
            renderValue={(selected) => selected.join(" - ")}
            onChange={handleChange}
          >
            <MenuItem value="Mon">Monday</MenuItem>
            <MenuItem value="Tue">Tuesday</MenuItem>
            <MenuItem value="Wed">Wednesday</MenuItem>
            <MenuItem value="Thu">Thursday</MenuItem>
            <MenuItem value="Fri">Fri</MenuItem>
            <MenuItem value="Sat">Saturday</MenuItem>
            <MenuItem value="Sun">Sunday</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="flex flex-col md:flex-row w-full justify-between gap-4 min-w-[300px] px-8">
        <TextField
          label="Age limit"
          name="ageLimit"
          type="number"
          value={newService.ageLimit}
          disabled={loading}
          onChange={handleChange}
          className="w-full md:w-1/2"
        />
        <TextField
          label="Minimum participants (Per purchase)"
          name="minimumParticipants"
          type="number"
          value={newService.minimumParticipants}
          disabled={loading}
          onChange={handleChange}
          className="w-full md:w-1/2"
        />
      </div>
      <div className="flex flex-col md:flex-row w-full justify-between gap-4 min-w-[300px] px-8">
        <TextField
          label="Maximum participants total"
          name="maximumParticipants"
          type="number"
          value={newService.maximumParticipants}
          disabled={loading}
          onChange={handleChange}
          className="w-full md:w-1/2"
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={newService.price}
          disabled={loading}
          className="w-full md:w-1/2"
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col md:flex-row w-full justify-between gap-4 min-w-[300px] px-8">
        <TextField
          label="Description"
          name="description"
          type="text"
          multiline
          rows={4}
          value={newService.description}
          disabled={loading}
          className="w-full"
          onChange={handleChange}
        />
      </div>
    </>
  );
}

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Title from "../../ui/Title";
import api from "../../api/api";

const Hours = () => {
  const [workingHours, setWorkingHours] = useState();
  const [previousHours, setPreviousHours] = useState();

  const handleSave = async () => {
    if (JSON.stringify(previousHours) === JSON.stringify(workingHours)) {
      toast.error("Please update hours");
      return;
    }
    setPreviousHours(workingHours);

    try {
      await api.put("/admin/working-hours", workingHours);
      toast.success("Hours updated successfully");
    } catch (error) {
      toast.error(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchWorkingHours = async () => {
      try {
        const res = await api.get("/working-hours");
        const { workingHours } = res.data;
        if (mounted) {
          setWorkingHours(workingHours);
          setPreviousHours(workingHours);
        }
      } catch (error) {
        toast.error(error.response?.data || error.message);
      }
    };
    fetchWorkingHours();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="Hours-component">
      <Title>
        <p>Update Hours</p>
      </Title>
      {workingHours && (
        <div className="Hours-container">
          {Object.entries(workingHours).map(([day, data]) => (
            <div key={day} className="Hours-box">
              <div className="Hours-state">
                <label className="flex w-fit items-center">
                  <input
                    className="Hours-checkbox"
                    type="checkbox"
                    checked={data.enabled}
                    onChange={(e) =>
                      setWorkingHours((prev) => ({
                        ...prev,
                        [day]: { ...prev[day], enabled: e.target.checked },
                      }))
                    }
                  />
                  <span className="Hours-dayname">{day}</span>
                </label>
                <div className="Hours-isOpen">
                  {data.enabled ? "Open" : "Close"}
                </div>
              </div>
              <div className="max-w-full">
                {data?.ranges?.map((range, i) => (
                  <div key={i} className="mt-2 flex gap-5">
                    <div className="Hours-intervals">
                      <input
                        type="time"
                        value={range.from}
                        disabled={!data.enabled}
                        onChange={(e) => {
                          const val = e.target.value;
                          setWorkingHours((prev) => {
                            const ranges = [...prev[day].ranges];
                            ranges[i] = { ...ranges[i], from: val };
                            return { ...prev, [day]: { ...prev[day], ranges } };
                          });
                        }}
                      />
                      <span>-</span>
                      <input
                        type="time"
                        value={range.to}
                        disabled={!data.enabled}
                        onChange={(e) => {
                          const val = e.target.value;
                          setWorkingHours((prev) => {
                            const ranges = [...prev[day].ranges];
                            ranges[i] = { ...ranges[i], to: val };
                            return { ...prev, [day]: { ...prev[day], ranges } };
                          });
                        }}
                      />
                    </div>

                    <button
                      onClick={() => {
                        setWorkingHours((prev) => {
                          const ranges = prev[day].ranges.filter(
                            (_, idx) => idx !== i,
                          );
                          return { ...prev, [day]: { ...prev[day], ranges } };
                        });
                      }}
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>

              <button
                className="Hours-Addinterval"
                onClick={() =>
                  setWorkingHours((prev) => ({
                    ...prev,
                    [day]: {
                      ...prev[day],
                      ranges: [
                        ...prev[day].ranges,
                        { from: "08:00", to: "17:00" },
                      ],
                    },
                  }))
                }
              >
                + Add interval
              </button>
              <button
                onClick={handleSave}
                disabled={false}
                type="submit"
                className="Hours-save"
              >
                Save changes
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Hours;

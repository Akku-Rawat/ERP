import React, { useState } from "react";

const CRMSettings = () => {
  const [defaultLeadStatus, setDefaultLeadStatus] = useState("New");
  const [ticketPriorityLevels, setTicketPriorityLevels] = useState(["Low", "Medium", "High"]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSaveSettings = () => {
    console.log({
      defaultLeadStatus,
      ticketPriorityLevels,
      notificationsEnabled,
    });
    alert("CRM Settings saved!");
  };

  const handlePriorityChange = (index: number, value: string) => {
  const newLevels = [...ticketPriorityLevels];
  newLevels[index] = value;
  setTicketPriorityLevels(newLevels);
   };


  const addPriorityLevel = () => {
    setTicketPriorityLevels([...ticketPriorityLevels, ""]);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">CRM Settings</h3>
      <div className="space-y-4 max-w-lg">
        <div>
          <label className="block mb-1 font-medium">Default Lead Status</label>
          <input
            type="text"
            value={defaultLeadStatus}
            onChange={(e) => setDefaultLeadStatus(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Ticket Priority Levels</label>
          {ticketPriorityLevels.map((level, index) => (
            <input
              key={index}
              type="text"
              value={level}
              onChange={(e) => handlePriorityChange(index, e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
          ))}
          <button className="text-blue-600 hover:underline" onClick={addPriorityLevel}>+ Add Priority Level</button>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={() => setNotificationsEnabled(!notificationsEnabled)}
            id="notif-enable"
          />
          <label htmlFor="notif-enable" className="font-medium">Enable Notifications</label>
        </div>

        <button
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
          onClick={handleSaveSettings}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default CRMSettings;

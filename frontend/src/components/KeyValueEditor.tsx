import React from 'react';
import './ComponentStyles.css';

export interface KeyValueItem {
  key: string;
  value: string;
  enabled: boolean;
  type?: string;
}

export interface FormDataEntry extends KeyValueItem {
  type: "text" | "file";
}

interface KeyValueEditorProps {
  items: KeyValueItem[];
  onChange: (items: KeyValueItem[]) => void;
  allowDisable?: boolean;
  allowTypeSelection?: boolean;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  title?: string;
}

export const KeyValueEditor: React.FC<KeyValueEditorProps> = ({
  items,
  onChange,
  allowDisable = true,
  allowTypeSelection = false,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
  title = 'Key-Value Pairs'
}) => {
  const handleChange = (index: number, field: keyof KeyValueItem, value: string | boolean) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  const handleAdd = () => {
    const newItem: KeyValueItem = {
      key: '',
      value: '',
      enabled: true
    };
    
    if (allowTypeSelection) {
      newItem.type = 'text';
    }
    
    onChange([...items, newItem]);
  };

  const handleDelete = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onChange(newItems);
  };

  const typeOptions = allowTypeSelection ? ['text', 'file'] : undefined;

  return (
    <div className="key-value-editor">
      <div className="key-value-header">
        <h4>{title}</h4>
        <button onClick={handleAdd} className="btn btn-secondary add-button">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Add
        </button>
      </div>
      
      {items.length > 0 ? (
        <table>
          <thead>
            <tr>
              {allowDisable && <th style={{ width: '40px' }}></th>}
              <th>Key</th>
              <th>Value</th>
              {typeOptions && <th>Type</th>}
              <th style={{ width: '40px' }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                {allowDisable && (
                  <td>
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={(e) => handleChange(index, 'enabled', e.target.checked)}
                    />
                  </td>
                )}
                <td>
                  <input
                    type="text"
                    value={item.key}
                    onChange={(e) => handleChange(index, 'key', e.target.value)}
                    placeholder={keyPlaceholder}
                    className={!item.enabled ? 'disabled' : ''}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) => handleChange(index, 'value', e.target.value)}
                    placeholder={valuePlaceholder}
                    className={!item.enabled ? 'disabled' : ''}
                  />
                </td>
                {typeOptions && (
                  <td>
                    <select
                      value={item.type}
                      onChange={(e) => handleChange(index, 'type', e.target.value)}
                      className={!item.enabled ? 'disabled' : ''}
                    >
                      {typeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                )}
                <td>
                  <button
                    onClick={() => handleDelete(index)}
                    className="action-button delete-button"
                    title="Remove"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">
          <p>No {title.toLowerCase()} defined yet</p>
          <button onClick={handleAdd} className="btn btn-secondary">
            Add {title.includes(' ') ? title.split(' ')[0].toLowerCase() : title.toLowerCase()}
          </button>
        </div>
      )}
    </div>
  );
}; 
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

class Person {
    public $id;
    public $firstname;
    public $lastname;
    public $phone;

    public function __construct($id = 0, $firstname = '', $lastname = '', $phone = '') {
        $this->id = $id;
        $this->firstname = $firstname;
        $this->lastname = $lastname;
        $this->phone = $phone;
    }

    public function toArray() {
        return [
            'id' => $this->id,
            'name' => $this->firstname,
            'family' => $this->lastname,
            'phone' => $this->phone
        ];
    }
}

class ContactApi {
    private $xml;

    public function __construct() {
        if (!file_exists('db.xml')) {
            $xml = new SimpleXMLElement('<contacts></contacts>');
            $xml->asXML('db.xml');
        }
        $this->xml = simplexml_load_file('db.xml');
    }

    public function list() {
        $contacts = [];
        foreach ($this->xml->contact as $contact) {
            $person = new Person(
                (int)$contact->id,
                (string)$contact->firstname,
                (string)$contact->lastname,
                (string)$contact->phone
            );
            $contacts[] = $person->toArray();
        }
        return $contacts;
    }

    public function add($data) {
        if (empty($data['name']) || empty($data['family']) || empty($data['phone'])) {
            return ['error' => 'Error'];
        }
        $id = 1;
        foreach ($this->xml->contact as $contact) {
            $currentId = (int)$contact->id;
            if ($currentId >= $id) $id = $currentId + 1;
        }
        $person = new Person($id, $data['name'], $data['family'], $data['phone']);
        $contact = $this->xml->addChild('contact');
        $contact->addChild('id', $person->id);
        $contact->addChild('firstname', $person->firstname);
        $contact->addChild('lastname', $person->lastname);
        $contact->addChild('phone', $person->phone);
        $this->xml->asXML('db.xml');
        return ['success' => true, 'id' => $id];
    }

    public function update($data) {
        if (empty($data['id']) || empty($data['name']) || empty($data['family']) || empty($data['phone'])) {
            return ['error' => 'Error'];
        }
        foreach ($this->xml->contact as $contact) {
            if ((int)$contact->id == $data['id']) {
                $person = new Person(
                    $data['id'],
                    $data['name'],
                    $data['family'],
                    $data['phone']
                );
                $contact->firstname = $person->firstname;
                $contact->lastname = $person->lastname;
                $contact->phone = $person->phone;
                $this->xml->asXML('db.xml');
                return ['success' => true];
            }
        }
        return ['error' => 'Not found'];
    }

    public function delete($id) {
        if (empty($id)) {
            return ['error' => 'Error'];
        }
        for ($i = 0; $i < count($this->xml->contact); $i++) {
            if ((int)$this->xml->contact[$i]->id == $id) {
                unset($this->xml->contact[$i]);
                $this->xml->asXML('db.xml');
                return ['success' => true];
            }
        }
        return ['error' => 'Not found'];
    }
}

$manager = new ContactApi();
$action = $_GET['action']!=''?$_GET['action']:'list';
$id = $_GET['id'] ?? '';
$data = json_decode(file_get_contents('php://input'), true);

if ($action === 'list') {
    echo json_encode($manager->list());
} elseif ($action === 'add') {
    echo json_encode($manager->add($data));
} elseif ($action === 'update') {
    echo json_encode($manager->update($data));
} elseif ($action === 'delete') {
    echo json_encode($manager->delete($data['id'] ?? 0));
}
?>